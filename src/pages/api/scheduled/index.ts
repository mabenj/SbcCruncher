import { sleep } from "@/utilities";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // Do something scheduled
    console.log("start");
    for (let i = 0; i < 10; i++) {
        console.log(i);
        await sleep(2000);
    }
    res.status(200).send("hello");
};

export default handler;

export const config = {
    type: "experimental-scheduled",
    schedule: "* * * * *" // every minute
};
