import { Segment } from "semantic-ui-react";

const MySegment = props => {

    const className = ["k-segment"];
    Boolean(props?.className) && className.push(props.className);

    return <Segment {...props} className={className.join(" ")}>
        {props.children || props.content}
    </Segment>

}

export default MySegment;