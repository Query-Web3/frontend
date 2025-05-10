from http.server import BaseHTTPRequestHandler, HTTPServer
import subprocess
import os


class WebhookHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        print(f"\n[Webhook Received] Path: {self.path}")
        print(post_data.decode())

        # ✅ 运行 shell 命令：yarn openapi
        try:
            print("start")
            process = subprocess.Popen(['bash', '-c', 'yarn openapi'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            for line in process.stdout:
                print(line, end='')
        except subprocess.CalledProcessError as e:
            print("[Command Failed]:\n", e.stderr)

        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'OK')


if __name__ == '__main__':
    server_address = ('', 8390)
    httpd = HTTPServer(server_address, WebhookHandler)
    print("Listening on port http://localhost:8390")
    httpd.serve_forever()
