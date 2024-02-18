def on_ir_button_pressed():
    global ir_input, direction, speed, line_follower
    ir_input = makerbit.ir_button()
    if ir_input == makerbit.ir_button_code(IrButton.UP):
        direction = "FORWARD"
    elif ir_input == makerbit.ir_button_code(IrButton.NUMBER_2):
        direction = "FORWARD"
    elif ir_input == makerbit.ir_button_code(IrButton.DOWN):
        direction = "REVERSE"
    elif ir_input == makerbit.ir_button_code(IrButton.NUMBER_8):
        direction = "REVERSE"
    elif ir_input == makerbit.ir_button_code(IrButton.LEFT):
        direction = "TRAVERSE_LEFT"
    elif ir_input == makerbit.ir_button_code(IrButton.RIGHT):
        direction = "TRAVERSE_RIGHT"
    elif ir_input == makerbit.ir_button_code(IrButton.NUMBER_6):
        direction = "ROTATE_CLOCKWISE"
    elif ir_input == makerbit.ir_button_code(IrButton.NUMBER_4):
        direction = "ROTATE_COUNTERCLOCKWISE"
    elif ir_input == makerbit.ir_button_code(IrButton.STAR):
        speed = 125
        serial.write_line("Speed: " + str(speed))
    elif ir_input == makerbit.ir_button_code(IrButton.HASH):
        speed = 255
        serial.write_line("Speed: " + str(speed))
    elif ir_input == makerbit.ir_button_code(IrButton.NUMBER_0):
        speed = 0
        serial.write_line("Speed: " + str(speed))
    elif ir_input == makerbit.ir_button_code(IrButton.NUMBER_5):
        line_follower = not (line_follower)
        serial.write_line("Line Follow: " + str(line_follower))
    else:
        direction = "STOP"
makerbit.on_ir_button(IrButton.ANY, IrButtonAction.PRESSED, on_ir_button_pressed)

def on_received_string(receivedString):
    global direction, speed, line_follower
    if receivedString == "F":
        direction = "FORWARD"
    elif receivedString == "R":
        direction = "REVERSE"
    elif receivedString == "TL":
        direction = "TRAVERSE_LEFT"
    elif receivedString == "TR":
        direction = "TRAVERSE_RIGHT"
    elif receivedString == "CW":
        direction = "ROTATE_CLOCKWISE"
    elif receivedString == "CCW":
        direction = "ROTATE_COUNTERCLOCKWISE"
    elif receivedString == "SS":
        speed = 125
    elif receivedString == "SF":
        speed = 255
    elif receivedString == "ST":
        speed = 0
    elif receivedString == "LI":
        line_follower = not (line_follower)
    else:
        direction = "STOP"
radio.on_received_string(on_received_string)

prev_direction = ""
start_time = 0
prev_display_direction = ""
direction = ""
ir_input = 0
line_follower = False
speed = 0
speed_fast = 255
speed_slow = 100
speed_turn_offset = 50
speed = 0
line_follower = False
serial.redirect_to_usb()
makerbit.connect_ir_receiver(DigitalPin.P8, IrProtocol.NEC)

def on_forever():
    global prev_display_direction
    if prev_display_direction != direction:
        prev_display_direction = direction
        if direction == "FORWARD":
            basic.show_arrow(ArrowNames.NORTH)
        elif direction == "REVERSE":
            basic.show_arrow(ArrowNames.SOUTH)
        elif direction == "ROTATE_CLOCKWISE":
            basic.show_arrow(ArrowNames.NORTH_WEST)
        elif direction == "ROTATE_COUNTERCLOCKWISE":
            basic.show_arrow(ArrowNames.NORTH_EAST)
        elif direction == "TRAVERSE_LEFT":
            basic.show_arrow(ArrowNames.EAST)
        elif direction == "TRAVERSE_RIGHT":
            basic.show_arrow(ArrowNames.WEST)
        elif direction == "STOP":
            basic.show_icon(IconNames.CHESSBOARD)
basic.forever(on_forever)

def on_forever2():
    global start_time, prev_direction
    start_time = control.millis()
    if prev_direction != direction:
        prev_direction = direction
        serial.write_line("Direction:" + direction)
        if direction == "FORWARD":
            motor.motor_run(motor.Motors.M1, motor.Dir.CCW, speed)
            motor.motor_run(motor.Motors.M2, motor.Dir.CCW, speed)
            motor.motor_run(motor.Motors.M3, motor.Dir.CCW, speed)
            motor.motor_run(motor.Motors.M4, motor.Dir.CCW, speed)
        elif direction == "REVERSE":
            motor.motor_run(motor.Motors.M1, motor.Dir.CW, speed)
            motor.motor_run(motor.Motors.M2, motor.Dir.CW, speed)
            motor.motor_run(motor.Motors.M3, motor.Dir.CW, speed)
            motor.motor_run(motor.Motors.M4, motor.Dir.CW, speed)
        elif direction == "ROTATE_CLOCKWISE":
            motor.motor_run(motor.Motors.M1,
                motor.Dir.CCW,
                min(255, speed + speed_turn_offset))
            motor.motor_run(motor.Motors.M2,
                motor.Dir.CCW,
                min(255, speed + speed_turn_offset))
            motor.motor_run(motor.Motors.M3,
                motor.Dir.CW,
                min(255, speed + speed_turn_offset))
            motor.motor_run(motor.Motors.M4,
                motor.Dir.CW,
                min(255, speed + speed_turn_offset))
        elif direction == "ROTATE_COUNTERCLOCKWISE":
            motor.motor_run(motor.Motors.M1,
                motor.Dir.CW,
                min(255, speed + speed_turn_offset))
            motor.motor_run(motor.Motors.M2,
                motor.Dir.CW,
                min(255, speed + speed_turn_offset))
            motor.motor_run(motor.Motors.M3,
                motor.Dir.CCW,
                min(255, speed + speed_turn_offset))
            motor.motor_run(motor.Motors.M4,
                motor.Dir.CCW,
                min(255, speed + speed_turn_offset))
        elif direction == "TRAVERSE_LEFT":
            motor.motor_run(motor.Motors.M1, motor.Dir.CCW, speed)
            motor.motor_run(motor.Motors.M2, motor.Dir.CW, speed)
            motor.motor_run(motor.Motors.M3, motor.Dir.CW, speed)
            motor.motor_run(motor.Motors.M4, motor.Dir.CCW, speed)
        elif direction == "TRAVERSE_RIGHT":
            motor.motor_run(motor.Motors.M1, motor.Dir.CW, speed)
            motor.motor_run(motor.Motors.M2, motor.Dir.CCW, speed)
            motor.motor_run(motor.Motors.M3, motor.Dir.CCW, speed)
            motor.motor_run(motor.Motors.M4, motor.Dir.CW, speed)
        elif direction == "STOP":
            motor.motor_stop_all()
        else:
            motor.motor_stop_all()
basic.forever(on_forever2)

def on_forever3():
    global direction
    if line_follower:
        if pins.digital_read_pin(DigitalPin.P1) == 1:
            direction = "FORWARD"
        elif pins.digital_read_pin(DigitalPin.P2) == 1:
            direction = "ROTATE_CLOCKWISE"
        elif pins.digital_read_pin(DigitalPin.P0) == 1:
            direction = "ROTATE_COUNTERCLOCKWISE"
        else:
            direction = "STOP"
basic.forever(on_forever3)
