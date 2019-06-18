import React from "react"
import { TextBlock } from "app/components"

const HeadingTwoBlock = ({ children, ...rest }) => {
    return (
        <TextBlock {...rest} kind="heading-two">
            {children}
        </TextBlock>
    )
}

export { HeadingTwoBlock }
