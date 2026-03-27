#!/usr/bin/env python3
"""Open Chrome → YouTube → Search ท้องฟ้า → Play"""
import subprocess
import time
import pyautogui

pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.5

print("🎵 เริ่ม: เปิด Chrome → YouTube → ท้องฟ้า")

# Step 1: Open Google Chrome
print("1️⃣ เปิด Chrome...")
subprocess.Popen(["open", "-a", "Google Chrome"])
time.sleep(3)

# Step 2: Go to YouTube
print("2️⃣ ไป YouTube...")
pyautogui.typewrite("https://www.youtube.com", interval=0.05)
pyautogui.press("enter")
time.sleep(4)

# Step 3: Click search box
print("3️⃣ คลิกช่องค้นหา...")
pyautogui.click(x=500, y=100)
time.sleep(1)

# Step 4: Type song name
print("4️⃣ พิมพ์: ท้องฟ้า...")
pyautogui.typewrite("ท้องฟ้า", interval=0.1)
time.sleep(0.5)
pyautogui.press("enter")
time.sleep(3)

# Step 5: Click first result
print("5️⃣ คลิกเพลงแรก...")
pyautogui.click(x=400, y=250)
time.sleep(2)

print("✅ เล่นเพลงแล้ว!")
print("🛑 ขยับเมาส์ไปมุมซ้ายบนเพื่อหยุด")
