import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import time

BASE_URL = "https://stagedog.github.io/"
TARGET_DIR = "./stagedog_site"

def clone_site():
    parsed_base = urlparse(BASE_URL)
    visited = set()
    queue = [BASE_URL]

    print("====== 🌟 开始全站克隆 ======")

    while queue:
        current_url = queue.pop(0)
        if current_url in visited:
            continue
        visited.add(current_url)

        try:
            print(f"正在读取页面: {current_url}")
            # 伪装浏览器请求
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            res = requests.get(current_url, headers=headers, timeout=15)

            if res.status_code != 200:
                print(f"⚠️ 无法访问 (状态码 {res.status_code}): {current_url}")
                continue

            # 解析本地存储路径
            parsed_url = urlparse(current_url)
            path = parsed_url.path

            # 如果是根目录或者以/结尾，默认生成 index.html
            if path.endswith('/') or not path:
                path = os.path.join(path, "index.html")
            elif not os.path.splitext(path)[1]:
                path += ".html"

            local_path = os.path.join(TARGET_DIR, path.lstrip('/'))
            os.makedirs(os.path.dirname(local_path), exist_ok=True)

            # 保存网页内容
            with open(local_path, "w", encoding="utf-8") as f:
                f.write(res.text)

            # 提取页面中的所有新链接提供给 AI 深度阅读
            soup = BeautifulSoup(res.text, 'html.parser')
            for a in soup.find_all('a', href=True):
                next_url = urljoin(current_url, a['href'])
                next_parsed = urlparse(next_url)

                # 核心规则：必须是同站链接，且不能是锚点跳转(#)
                if next_parsed.netloc == parsed_base.netloc and "#" not in a['href']:
                    # 去掉参数纯净排队
                    clean_url = next_url.split('?')[0].split('#')[0]
                    if clean_url not in visited and clean_url not in queue:
                        queue.append(clean_url)

            time.sleep(0.1) # 稍微温柔一点请求

        except Exception as e:
            print(f"❌ 抓取失败 {current_url}: {e}")

    print(f"\n====== 🎉 克隆完成！整个项目文件夹已保存在: {os.path.abspath(TARGET_DIR)} ======")

if __name__ == "__main__":
    # 如果缺少依赖包，请在终端执行: pip install requests beautifulsoup4
    try:
        clone_site()
    except ImportError:
        print("检测到缺少依赖，正在尝试自动安装...")
        os.system('pip install requests beautifulsoup4')
        clone_site()
