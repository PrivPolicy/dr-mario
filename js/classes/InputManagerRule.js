class InputManagerRule {
    constructor(handler, triggers, allowHold, holdTime) {
        this.handler = handler;
        this.triggers = triggers;
        this.allowHold = allowHold;
        this.holdTime = holdTime;
        this.task = null;
        this.pressed = false;
    }
}