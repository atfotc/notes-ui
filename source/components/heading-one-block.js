import React from "react"
import { TextBlock } from "app/components"

const HeadingOneBlock = ({ children, ...rest }) => {
    return (
        <TextBlock {...rest} kind="heading-one">
            {children}
        </TextBlock>
    )
}

export { HeadingOneBlock }
