import { sleep } from "../utils/helpers.js";

export class StateManager {
    constructor(flyingDutchman, humanSockets, apiSockets, iteration) {
        this.flyingDutchman = flyingDutchman;
        this.humanSockets = humanSockets;
        this.apiSockets = apiSockets;
        this.updateInterval = iteration; // default updateInterval = 10 sec
    }

    watchupdateInterval() {
        //this.updateInterval = iteration;
    }

    auto() {
        this.flyingDutchman.get_offline_shows(shows => {
            console.log("OFFLINE: ", shows)
            shows.forEach(show => {
                this.humanSockets.disconnectAllUserSockets(show);
                this.apiSockets.disconnectAllSockets(show);
                this.humanSockets.debug(show);
                this.apiSockets.debug(show);
            })
        })



        this.flyingDutchman.get_online_shows(shows => {
            console.log("ONLINE: ", shows)
            shows.forEach(show => {
                this.flyingDutchman.update_flys(show, () => {
                    let userResult = this.flyingDutchman.get_flying_USER_result(show) 
                    let apiResult = this.flyingDutchman.get_flying_API_result(show) 
                    this.humanSockets.sendAutoEval(show, userResult);
                    this.apiSockets.sendAutoEval(show, apiResult);
                    this.flyingDutchman.debug(show);
                    this.humanSockets.debug(show);
                    this.apiSockets.debug(show);
                });
            })
        });
        return sleep(this.updateInterval).then(() => this.auto());

        // nothing is online... still ticking

      }

    start() {
        this.auto();
    }


}
