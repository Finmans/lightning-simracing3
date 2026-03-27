#!/usr/bin/env python3
"""
PyAutoGUI wrapper with Command+F2 stop hotkey
ทำงานร่วมกับ Lightning SimRacing project

วิธีใช้:
  python3 scripts/keyboard_mouse.py <command> [args...]

คำสั่งหยุดฉุกเฉิน: Command+F2 หรือ ขยับเมาส์ไปมุมซ้ายบน
"""

import sys
import time
import threading
import pyautogui
import keyboard

# Fail-safe - PyAutoGUI หยุดถ้าเมาส์ไปมุมซ้ายบน
pyautogui.FAILSAFE = True

# Pause ระหว่างคำสั่ง
pyautogui.PAUSE = 0.3

# Global flag สำหรับ stop
stop_flag = False

def listen_for_stop():
    """ฟัง Command+F2 เพื่อหยุด script"""
    global stop_flag
    print("🛑 กด Command+F2 เพื่อหยุด (หรือขยับเมาส์ไปมุมซ้ายบน)")
    while True:
        try:
            if keyboard.is_pressed('f2') and keyboard.is_pressed('command'):
                print("\n⚠️ ได้รับคำสั่งหยุด!")
                stop_flag = True
                sys.exit(0)
        except:
            break
        time.sleep(0.1)

def start_stop_listener():
    """เริ่ม thread สำหรับฟัง hotkey"""
    t = threading.Thread(target=listen_for_stop, daemon=True)
    t.start()

# ==================== COMMANDS ====================

def do_screen_size():
    w, h = pyautogui.size()
    print(f"{w}x{h}")
    return f"{w}x{h}"

def do_mouse_position():
    x, y = pyautogui.position()
    print(f"{x},{y}")
    return f"{x},{y}"

def do_mouse_move(x, y, duration=0.0):
    if stop_flag: return
    pyautogui.moveTo(int(x), int(y), duration=duration)
    print(f"Moved to ({x}, {y})")

def do_mouse_click(button='left', clicks=1, x=None, y=None):
    if stop_flag: return
    if x is not None and y is not None:
        pyautogui.click(x=int(x), y=int(y), clicks=int(clicks), button=button)
    else:
        pyautogui.click(clicks=int(clicks), button=button)
    print(f"Clicked {clicks}x {button} at ({x},{y})" if x else f"Clicked {clicks}x {button}")

def do_mouse_double_click(x=None, y=None):
    if stop_flag: return
    if x is not None and y is not None:
        pyautogui.doubleClick(x=int(x), y=int(y))
    else:
        pyautogui.doubleClick()
    print(f"Double clicked at ({x},{y})" if x else "Double clicked")

def do_mouse_drag(x1, y1, x2, y2, duration=1.0):
    if stop_flag: return
    pyautogui.moveTo(int(x1), int(y1))
    pyautogui.drag(int(x2)-int(x1), int(y2)-int(y1), duration=float(duration))
    print(f"Dragged from ({x1},{y1}) to ({x2},{y2})")

def do_mouse_scroll(clicks=5, x=None, y=None):
    if stop_flag: return
    if x is not None and y is not None:
        pyautogui.scroll(int(clicks), x=int(x), y=int(y))
    else:
        pyautogui.scroll(int(clicks))
    print(f"Scrolled {clicks} at ({x},{y})" if x else f"Scrolled {clicks}")

def do_typewrite(text):
    if stop_flag: return
    pyautogui.typewrite(text, interval=0.05)
    print(f"Typed: {text}")

def do_press(key):
    if stop_flag: return
    pyautogui.press(key)
    print(f"Pressed: {key}")

def do_hotkey(*keys):
    if stop_flag: return
    pyautogui.hotkey(*keys)
    print(f"Hotkey: {'+'.join(keys)}")

def do_screenshot(filename="screenshot.png"):
    if stop_flag: return
    pyautogui.screenshot(filename)
    print(f"Saved: {filename}")

def do_locate_on_screen(image, confidence=0.8):
    if stop_flag: return None
    try:
        loc = pyautogui.locateOnScreen(image, confidence=confidence)
        if loc:
            print(f"Found {image} at {loc}")
            return loc
        else:
            print(f"Not found: {image}")
            return None
    except Exception as e:
        print(f"Error locating {image}: {e}")
        return None

# ==================== MAIN ====================

COMMANDS = {
    'screen_size':       (do_screen_size, []),
    'mouse_position':     (do_mouse_position, []),
    'mouse_move':        (do_mouse_move, ['x','y','duration']),
    'mouse_click':       (do_mouse_click, ['button','clicks','x','y']),
    'mouse_click_at':    (do_mouse_click, ['x','y','button','clicks']),
    'mouse_double_click':(do_mouse_double_click, ['x','y']),
    'mouse_drag':        (do_mouse_drag, ['x1','y1','x2','y2','duration']),
    'mouse_scroll':       (do_mouse_scroll, ['clicks','x','y']),
    'typewrite':         (do_typewrite, ['text']),
    'press':             (do_press, ['key']),
    'hotkey':            (do_hotkey, ['*keys']),
    'screenshot':        (do_screenshot, ['filename']),
    'locate_on_screen':  (do_locate_on_screen, ['image','confidence']),
}

if __name__ == '__main__':
    # เริ่ม stop listener
    start_stop_listener()

    if len(sys.argv) < 2:
        print(__doc__)
        print("คำสั่งที่มี:")
        for name in COMMANDS:
            print(f"  {name}")
        sys.exit(1)

    cmd = sys.argv[1]
    if cmd not in COMMANDS:
        print(f"ไม่รู้จักคำสั่ง: {cmd}")
        sys.exit(1)

    func, params = COMMANDS[cmd]
    args = {}

    i = 2
    for p in params:
        if p == '*keys':
            args[p] = sys.argv[i:]
            break
        if i < len(sys.argv):
            v = sys.argv[i]
            if v.lower() == 'none' or v == '':
                args[p] = None
            elif v.lower() == 'true':
                args[p] = True
            elif v.lower() == 'false':
                args[p] = False
            else:
                try:
                    args[p] = int(v)
                except ValueError:
                    try:
                        args[p] = float(v)
                    except ValueError:
                        args[p] = v
            i += 1
        else:
            if p in ('button', 'key', 'filename', 'image', 'text', 'duration'):
                args[p] = None
            elif p in ('clicks', 'x', 'y', 'confidence', 'x1', 'y1', 'x2', 'y2'):
                args[p] = None
            else:
                args[p] = []

    if cmd == 'hotkey':
        result = func(*args['*keys'])
    else:
        result = func(**{k:v for k,v in args.items() if v is not None or k not in params})
