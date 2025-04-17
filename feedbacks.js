import { combineRgb } from "@companion-module/base"

export function getFeedbackDefinitions(self) {
    return {
        testFeedback: {
            type: 'boolean',
            name: 'My first feedback',
            defaultStyle: {
                // The default style change for a boolean feedback
                // The user will be able to customise these values as well as the fields that will be changed
                bgcolor: combineRgb(255, 0, 0),
                color: combineRgb(0, 0, 0),
            },
            // options is how the user can choose the condition the feedback activates for
            options: [{
                type: 'number',
                label: 'Source',
                id: 'source',
                default: 1
            }],
            callback: (feedback) => {
                // This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
                if (self.some_device_state.source == feedback.options.source) {
                    return true
                } else {
                    return false
                }
            }
        }
    }
}