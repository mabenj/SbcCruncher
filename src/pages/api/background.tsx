import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
    // Do something scheduled
    console.log("test");
    res.status(200).send("hello");
};

export const config = {
    type: "experimental-scheduled",
    schedule: "* * * * *"
};
