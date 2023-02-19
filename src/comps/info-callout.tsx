import {
    Callout,
    ICalloutProps,
    mergeStyleSets,
    FontSizes,
    FontWeights,
    Link,
    Label,
} from '@fluentui/react'
import type { FunctionComponent } from 'react'
import { useRecoilValue } from 'recoil'
import { roomState } from '../atoms'

const callout = mergeStyleSets({
    container: {
        padding: '1em',
    },
    title: {
        fontSize: '1.75em',
        fontWeight: FontWeights.semilight,
        margin: '0',
    },
    secondaryTitle: {
        fontSize: '1em',
        fontWeight: FontWeights.semilight,
        margin: '.25em 0',
    },
    body: {
        margin: '.5em 0',
    },
    footer: {
        fontSize: FontSizes.smallPlus,
        marginTop: '2em',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'space-between',
    },
})



const MyCallout: FunctionComponent<ICalloutProps & MyCalloutProps> = ({  ...props }) => {
    const room = useRecoilValue(roomState)
    const link = `${window.location.origin}/room/${room?.id}`
    return (
        <Callout
            className={callout.container}
            role="dialog"
            calloutMaxWidth={400}
            // eslint-disable-next-line
            {...props}
        >
            <h1 className={callout.title}>{room?.name}</h1>
            <h2 className={callout.secondaryTitle}>
                Room created by {room?.created_by || '<Enter your name next time>'}
            </h2>
            <h2 className={callout.secondaryTitle}>
                ID: <Label>{room?.id}</Label>
            </h2>
            <div className={callout.body}>
                You can invite people directly to this chat by sharing this link{' '}
                <Label>{link}</Label>
            </div>
        </Callout>
    )
}

export default MyCallout
