/**
 * Created by zeman on 13-May-17.
 */
export function removeDuplicates(data) {
    return data.reduce((accumulator, current) => {
        if (accumulator.some((item) => {
                return (item.ID === current.ID);
            })) {
            return accumulator;
        } else {
            return [...accumulator, current];
        }
    }, []);
}