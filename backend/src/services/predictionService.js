export const calculateWaitTime = (position) => {
    const AVG_TIME_PER_PERSON = 5; 
    return position <= 1 ? 2 : (position - 1) * AVG_TIME_PER_PERSON;
};