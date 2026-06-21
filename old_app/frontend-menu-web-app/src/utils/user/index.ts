import { local } from "..";
import moment from "moment";

const users = {
    countPoints: (points: number | undefined, total?: number): {totalPoints: number, availablePoints: number} => {
        if (!points) return {totalPoints: 0, availablePoints: 0};
        let totalPoints = (points % 2 === 0 ? points : points - 1) * 2.5;
        let availablePoints

    
        if (total && total / 5 < totalPoints) {
            const t = Math.floor(total / 5)
            const remainder = Math.floor(total / 5) % 5
            console.log('totalPoints++:', remainder)
            console.log('tot:', t)
            console.log('totalPoints++:', totalPoints)

            availablePoints = t - remainder
            console.log('availablePointsIF++:', totalPoints)

        } else {
            console.log('totalPoints:', totalPoints)
            availablePoints = totalPoints
            console.log('availablePointsELSE:', totalPoints)

        }

        // console.log(accessPoints);
        return {totalPoints, availablePoints}
    },
    checkExpire: (time: any) => {
        const current = moment().format()
        console.log('current:',current)
        const expired = moment(time).format()
        console.log('expired:',expired)
        if (moment(expired).isBefore(current)) {
            local.removeAll()
            window.location.reload()
        }
    }
}

export default users