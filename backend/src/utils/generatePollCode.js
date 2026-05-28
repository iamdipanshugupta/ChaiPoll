import {nanoid} from 'nanoid';

const generatePollCode = () =>{
    return nanoid(8);
}

export default generatePollCode;