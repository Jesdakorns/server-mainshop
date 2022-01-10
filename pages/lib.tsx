import React, { useEffect, useState } from 'react'
import { ConvertDate } from './../src/plugin/convert-date'



const lib = () => {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        (async () => {
            // let date = new Date('January 1, 2022 2:01:00')
            let date = new Date('December 20, 2021 2:01:00')
            let num = await ConvertDate(date, 'time', 'en', 'short');
            console.log(`num`, num)
        })()

    }, [])
    return (
        <>

        </>
    )
}

export default lib
