/**
* Usage Example:
*   var poller = new Poller();
*   poller.poll({
*      shouldPollingStop: function(params) {
*          // Note: until this condition is true, it keeps polling (unless max retry limit reached)
*          return (result == "SUCCESS");
*      },
*      onSuccess: function() {
*          // once the condition is met, this is what will get executed
*          console.log('Finally result is SUCCESS');
*      },
*      onRetryLimitExceeded: function(params) {
*          console.log('Maximum retry limit reached');
*      },
*      interval: 100, // in milliseconds
*      maxRetries: 5,
*      params: {} //
*   });
*
* @param options
*/

export default class Poller {
    constructor() {
        this.tries = 1;
        this._timer = null;
    }

    poll = options => {
        let self = this, {maxRetries = 20, interval = 100, params = {}} = options;

        const pollHandler = function() {
            // If the condition is met, we're done!
            if (options.shouldPollingStop && options.shouldPollingStop(params)) {
                self.tries = 1;
                self._timer = null;
                options.onSuccess && options.onSuccess(params);
            } else if (self.tries <= maxRetries) {
                // If the condition isn't met but the number of retries hasn't exceeded, go again
                self.tries = self.tries + 1;
                self._timer = setTimeout(pollHandler, interval);
            } else {
                // Didn't match and retry limit exceeded, reject!
                self.tries = 1;
                self._timer = null;
                options.onRetryLimitExceeded && options.onRetryLimitExceeded(params);
            }
        };
        pollHandler();
    };

    cancelPoll = () => {
        if (this._timer) {
            clearTimeout(this._timer);
            this.tries = 1;
            this._timer = null;
        }
    };
}
