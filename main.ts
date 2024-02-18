makerbit.onIrButton(IrButton.Any, IrButtonAction.Pressed, function () {
    ir_input = makerbit.irButton()
    if (ir_input == makerbit.irButtonCode(IrButton.Up)) {
        direction = "FORWARD"
    } else if (ir_input == makerbit.irButtonCode(IrButton.Number_2)) {
        direction = "FORWARD"
    } else if (ir_input == makerbit.irButtonCode(IrButton.Down)) {
        direction = "REVERSE"
    } else if (ir_input == makerbit.irButtonCode(IrButton.Number_8)) {
        direction = "REVERSE"
    } else if (ir_input == makerbit.irButtonCode(IrButton.Left)) {
        direction = "TRAVERSE_LEFT"
    } else if (ir_input == makerbit.irButtonCode(IrButton.Right)) {
        direction = "TRAVERSE_RIGHT"
    } else if (ir_input == makerbit.irButtonCode(IrButton.Number_6)) {
        direction = "ROTATE_CLOCKWISE"
    } else if (ir_input == makerbit.irButtonCode(IrButton.Number_4)) {
        direction = "ROTATE_COUNTERCLOCKWISE"
    } else if (ir_input == makerbit.irButtonCode(IrButton.Star)) {
        speed = 125
        serial.writeLine("Speed: " + speed)
    } else if (ir_input == makerbit.irButtonCode(IrButton.Hash)) {
        speed = 255
        serial.writeLine("Speed: " + speed)
    } else if (ir_input == makerbit.irButtonCode(IrButton.Number_0)) {
        speed = 0
        serial.writeLine("Speed: " + speed)
    } else if (ir_input == makerbit.irButtonCode(IrButton.Number_5)) {
        line_follower = !(line_follower)
        serial.writeLine("Line Follow: " + line_follower)
    } else {
        direction = "STOP"
    }
})
radio.onReceivedString(function (receivedString) {
    serial.writeLine("Recv: " + receivedString)
    if (receivedString == "F") {
        direction = "FORWARD"
    } else if (receivedString == "R") {
        direction = "REVERSE"
    } else if (receivedString == "TL") {
        direction = "TRAVERSE_LEFT"
    } else if (receivedString == "TR") {
        direction = "TRAVERSE_RIGHT"
    } else if (receivedString == "CW") {
        direction = "ROTATE_CLOCKWISE"
    } else if (receivedString == "CCW") {
        direction = "ROTATE_COUNTERCLOCKWISE"
    } else if (receivedString == "SS") {
        speed = 125
    } else if (receivedString == "SF") {
        speed = 255
    } else if (receivedString == "ST") {
        speed = 0
    } else if (receivedString == "LI") {
        line_follower = !(line_follower)
    } else if (receivedString == "HO") {
        direction = "HORN"
    } else {
        direction = "STOP"
    }
})
let prev_direction = ""
let start_time = 0
let prev_display_direction = ""
let direction = ""
let ir_input = 0
let line_follower = false
let speed = 0
let speed_fast = 255
let speed_slow = 100
let speed_turn_offset = 50
speed = 0
line_follower = false
serial.redirectToUSB()
makerbit.connectIrReceiver(DigitalPin.P8, IrProtocol.NEC)
basic.forever(function () {
    if (prev_display_direction != direction) {
        prev_display_direction = direction
        if (direction == "FORWARD") {
            basic.showArrow(ArrowNames.North)
        } else if (direction == "REVERSE") {
            basic.showArrow(ArrowNames.South)
        } else if (direction == "ROTATE_CLOCKWISE") {
            basic.showArrow(ArrowNames.NorthWest)
        } else if (direction == "ROTATE_COUNTERCLOCKWISE") {
            basic.showArrow(ArrowNames.NorthEast)
        } else if (direction == "TRAVERSE_LEFT") {
            basic.showArrow(ArrowNames.East)
        } else if (direction == "TRAVERSE_RIGHT") {
            basic.showArrow(ArrowNames.West)
        } else if (direction == "STOP") {
            basic.showIcon(IconNames.Chessboard)
        }
    }
})
basic.forever(function () {
    start_time = control.millis()
    if (prev_direction != direction) {
        prev_direction = direction
        serial.writeLine("Direction:" + direction)
        if (direction == "FORWARD") {
            motor.MotorRun(motor.Motors.M1, motor.Dir.CCW, speed)
            motor.MotorRun(motor.Motors.M2, motor.Dir.CCW, speed)
            motor.MotorRun(motor.Motors.M3, motor.Dir.CCW, speed)
            motor.MotorRun(motor.Motors.M4, motor.Dir.CCW, speed)
        } else if (direction == "REVERSE") {
            motor.MotorRun(motor.Motors.M1, motor.Dir.CW, speed)
            motor.MotorRun(motor.Motors.M2, motor.Dir.CW, speed)
            motor.MotorRun(motor.Motors.M3, motor.Dir.CW, speed)
            motor.MotorRun(motor.Motors.M4, motor.Dir.CW, speed)
        } else if (direction == "ROTATE_CLOCKWISE") {
            motor.MotorRun(motor.Motors.M1, motor.Dir.CCW, Math.min(255, speed + speed_turn_offset))
            motor.MotorRun(motor.Motors.M2, motor.Dir.CCW, Math.min(255, speed + speed_turn_offset))
            motor.MotorRun(motor.Motors.M3, motor.Dir.CW, Math.min(255, speed + speed_turn_offset))
            motor.MotorRun(motor.Motors.M4, motor.Dir.CW, Math.min(255, speed + speed_turn_offset))
        } else if (direction == "ROTATE_COUNTERCLOCKWISE") {
            motor.MotorRun(motor.Motors.M1, motor.Dir.CW, Math.min(255, speed + speed_turn_offset))
            motor.MotorRun(motor.Motors.M2, motor.Dir.CW, Math.min(255, speed + speed_turn_offset))
            motor.MotorRun(motor.Motors.M3, motor.Dir.CCW, Math.min(255, speed + speed_turn_offset))
            motor.MotorRun(motor.Motors.M4, motor.Dir.CCW, Math.min(255, speed + speed_turn_offset))
        } else if (direction == "TRAVERSE_LEFT") {
            motor.MotorRun(motor.Motors.M1, motor.Dir.CCW, speed)
            motor.MotorRun(motor.Motors.M2, motor.Dir.CW, speed)
            motor.MotorRun(motor.Motors.M3, motor.Dir.CW, speed)
            motor.MotorRun(motor.Motors.M4, motor.Dir.CCW, speed)
        } else if (direction == "TRAVERSE_RIGHT") {
            motor.MotorRun(motor.Motors.M1, motor.Dir.CW, speed)
            motor.MotorRun(motor.Motors.M2, motor.Dir.CCW, speed)
            motor.MotorRun(motor.Motors.M3, motor.Dir.CCW, speed)
            motor.MotorRun(motor.Motors.M4, motor.Dir.CW, speed)
        } else if (direction == "STOP") {
            motor.motorStopAll()
        } else if (direction == "\"HORN\"") {
            music.play(music.tonePlayable(262, music.beat(BeatFraction.Breve)), music.PlaybackMode.InBackground)
        } else {
            motor.motorStopAll()
        }
    }
})
basic.forever(function () {
    if (line_follower) {
        if (pins.digitalReadPin(DigitalPin.P1) == 1) {
            direction = "FORWARD"
        } else if (pins.digitalReadPin(DigitalPin.P2) == 1) {
            direction = "ROTATE_CLOCKWISE"
        } else if (pins.digitalReadPin(DigitalPin.P0) == 1) {
            direction = "ROTATE_COUNTERCLOCKWISE"
        } else {
            direction = "STOP"
        }
    }
})
