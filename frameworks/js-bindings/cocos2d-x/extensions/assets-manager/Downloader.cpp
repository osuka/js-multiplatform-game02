/****************************************************************************
 Copyright (c) 2013 cocos2d-x.org
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#include "Downloader.h"

#include <curl/curl.h>
#include <curl/easy.h>
#include <stdio.h>
#include <thread>

using namespace cocos2d;

NS_CC_EXT_BEGIN;

#define BUFFER_SIZE         8192
#define MAX_FILENAME        512
#define LOW_SPEED_LIMIT     1L
#define LOW_SPEED_TIME      5L

static size_t curlWriteFunc(void *ptr, size_t size, size_t nmemb, void *userdata)
{
    FILE *fp = (FILE*)userdata;
    size_t written = fwrite(ptr, size, nmemb, fp);
    return written;
}

int downloadProgressFunc(Downloader::ProgressData *ptr, double totalToDownload, double nowDownloaded, double totalToUpLoad, double nowUpLoaded)
{
    if (ptr->downloaded != nowDownloaded)
    {
        ptr->downloaded = nowDownloaded;
        
        std::string url = ptr->url;
        std::string customId = ptr->customId;
        std::shared_ptr<Downloader> downloader = ptr->downloader.lock();
        
        Director::getInstance()->getScheduler()->performFunctionInCocosThread([=]{
            auto callback = downloader->getProgressCallback();
            if (downloader != nullptr && callback != nullptr)
                callback(totalToDownload, nowDownloaded, url, customId);
        });
    }
    
    return 0;
}


Downloader::Downloader()
: _onError(nullptr)
, _onProgress(nullptr)
, _onSuccess(nullptr)
, _connectionTimeout(0)
{
}

Downloader::~Downloader()
{
}

int Downloader::getConnectionTimeout()
{
    return _connectionTimeout;
}

void Downloader::setConnectionTimeout(int timeout)
{
    if (timeout >= 0)
        _connectionTimeout = timeout;
}

void Downloader::notifyError(ErrorCode code, const std::string &msg/* ="" */, const std::string &customId/* ="" */)
{
    std::shared_ptr<Downloader> downloader = shared_from_this();
    Director::getInstance()->getScheduler()->performFunctionInCocosThread([=]{
        Error err;
        err.code = code;
        err.message = msg;
        err.customId = customId;
        if (downloader != nullptr && downloader->_onError != nullptr)
            downloader->_onError(err);
    });
}

std::string Downloader::getFileNameFromUrl(const std::string &srcUrl)
{
    // Find file name and file extension
    std::string filename;
    unsigned long found = srcUrl.find_last_of("/\\");
    if (found != std::string::npos)
        filename = srcUrl.substr(found+1);
    return filename;
}

FILE *Downloader::prepareDownload(const std::string &srcUrl, const std::string &storagePath, const std::string &customId)
{
    FILE *fp = nullptr;
    
    Error err;
    err.customId = customId;
    // Asserts
    std::string filename = getFileNameFromUrl(srcUrl);
    if (filename.size() == 0)
    {
        err.code = ErrorCode::INVALID_URL;
        err.message = "Invalid url or filename not exist error: " + srcUrl;
        if (this->_onError) this->_onError(err);
        return fp;
    }
    
    // Create a file to save package.
    const std::string outFileName = storagePath;
    fp = fopen(outFileName.c_str(), "wb");
    if (!fp)
    {
        err.code = ErrorCode::CREATE_FILE;
        err.message = "Can not create file " + outFileName;
        if (this->_onError) this->_onError(err);
    }
    
    return fp;
}

void Downloader::downloadAsync(const std::string &srcUrl, const std::string &storagePath, const std::string &customId/* = ""*/)
{
    FILE *fp = prepareDownload(srcUrl, storagePath, customId);
    if (fp != nullptr)
    {
        auto t = std::thread(&Downloader::download, this, srcUrl, fp, customId);
        t.detach();
    }
}

void Downloader::downloadSync(const std::string &srcUrl, const std::string &storagePath, const std::string &customId/* = ""*/)
{
    FILE *fp = prepareDownload(srcUrl, storagePath, customId);
    if (fp != nullptr)
    {
        download(srcUrl, fp, customId);
    }
}

void Downloader::batchDownload(const std::unordered_map<std::string, Downloader::DownloadUnit> &units)
{
    for (auto it = units.cbegin(); it != units.cend(); it++) {
        DownloadUnit unit = it->second;
        std::string srcUrl = unit.srcUrl;
        std::string storagePath = unit.storagePath;
        std::string customId = unit.customId;
        
        auto t = std::thread(&Downloader::downloadSync, this, srcUrl, storagePath, customId);
        t.detach();
    }
}

void Downloader::download(const std::string &srcUrl, FILE *fp, const std::string &customId)
{
    std::shared_ptr<Downloader> downloader = shared_from_this();
    ProgressData data;
    data.customId = customId;
    data.url = srcUrl;
    data.downloader = downloader;
    data.downloaded = 0;
    
    void *curl = curl_easy_init();
    if (!curl)
    {
        this->notifyError(ErrorCode::CURL_UNINIT, "Can not init curl");
        return;
    }
    
    // Download pacakge
    CURLcode res;
    curl_easy_setopt(curl, CURLOPT_URL, srcUrl.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, curlWriteFunc);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, fp);
    curl_easy_setopt(curl, CURLOPT_NOPROGRESS, false);
    curl_easy_setopt(curl, CURLOPT_PROGRESSFUNCTION, downloadProgressFunc);
    curl_easy_setopt(curl, CURLOPT_PROGRESSDATA, &data);
    curl_easy_setopt(curl, CURLOPT_FAILONERROR, true);
    if (_connectionTimeout) curl_easy_setopt(curl, CURLOPT_CONNECTTIMEOUT, _connectionTimeout);
    curl_easy_setopt(curl, CURLOPT_NOSIGNAL, 1L);
    curl_easy_setopt(curl, CURLOPT_LOW_SPEED_LIMIT, LOW_SPEED_LIMIT);
    curl_easy_setopt(curl, CURLOPT_LOW_SPEED_TIME, LOW_SPEED_TIME);
    
    res = curl_easy_perform(curl);
    if (res != CURLE_OK)
    {
        this->notifyError(ErrorCode::NETWORK, "Error when download file", customId);
    }
    else
    {
        Director::getInstance()->getScheduler()->performFunctionInCocosThread([srcUrl, customId, downloader]{
            if (downloader != nullptr && downloader->_onSuccess != nullptr)
                downloader->_onSuccess(srcUrl, customId);
        });
    }
    fclose(fp);
    curl_easy_cleanup(curl);
    
}

NS_CC_EXT_END;