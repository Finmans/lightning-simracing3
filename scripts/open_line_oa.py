#!/usr/bin/env python3
"""Open LINE Official Account Manager"""
import subprocess
import time
import pyautogui

pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.5

print("📱 เริ่ม: เปิด LINE OA Dashboard")

# Step 1: Open browser to LINE OA
print("1️⃣ เปิด LINE Official Account Manager...")
subprocess.Popen(["open", "-a", "Google Chrome"])
time.sleep(3)

# Go directly to LINE OA page
print("2️⃣ ไป LINE OA Manager...")
pyautogui.typewrite("https://manager.line.biz/", interval=0.05)
pyautogui.press("enter")
time.sleep(5)

# Click somewhere to make sure page loaded
print("3️⃣ รอโหลดหน้า...")
pyautogui.click(x=500, y=500)
time.sleep(2)

print("✅ เปิด LINE OA แล้ว!")
print("📌 ดูที่ Chrome - ควรจะเห็นหน้า LINE Official Account Manager")
print("🛑 ขยับเมาส์ไปมุมซ้ายบนเพื่อหยุด")
