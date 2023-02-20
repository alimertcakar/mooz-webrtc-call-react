/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-props-no-spreading */
// ts-nocheck
import { useEffect, useState } from 'react'
import { Stack, Text, Pivot, PivotItem } from '@fluentui/react'
import fscreen from 'fscreen'
import { useRecoilState, useRecoilValue } from 'recoil'
import { preferencesState, socketState } from '../atoms'
import CreateMeeting from './create'
import JoinMeeting from './join'
import {
    container,
    containerInner,
    heading,
    mr4,
    options,
    divRooms,
    parentContainer,
} from './styles'

const pivotStyles = {
    root: {
        // display: 'flex',
        // justifyContent: 'center'
    },
    itemContainer: {
        padding: '.5em',
        width: '300px',
        height: '225px',
    },
}

const useRooms = () => {
    const socket = useRecoilValue(socketState)
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        socket.emit('get_rooms_list')
        socket.on('response_get_rooms_list', res => {
            setRooms(res)
        })

        return () => {
            socket.off('response_get_rooms_list')
        }
    }, [])

    return { rooms }
}

const Room = ({ name, id }) => {
    const socket = useRecoilValue(socketState)
    const [preferences, setPreferences] = useRecoilState(preferencesState)

    const joinRoom = roomId => {
        socket.emit('join_room', { name, link: roomId }, ({ error: err }) => {
            // on  should redirect to main app via 'joined_room' event listened in src/index
            if (err) {
                alert(err)
                return
            }
            setPreferences({ name: 'Todo Quick Join Name' })
        })
    }

    return (
        <div style={{ display: 'block', border: '1px solid #43aaff', padding: 5, margin: 5 }}>
            {name} <button onClick={() => joinRoom(id)}>join</button>
        </div>
    )
}

const Landing = () => {
    let defaultKey = 'create'
    let defaultId
    const path = window.location.pathname
    const REGEX = /^\/room\/(?<id>[0-9a-zA-Z-_]+)/
    const match = path.match(REGEX)
    if (match) {
        defaultKey = 'join'
        defaultId = match.groups?.id
    }
    useEffect(() => {
        if (fscreen.fullscreenElement) fscreen.exitFullscreen()
    }, [])

    const { rooms } = useRooms()

    return (
        <div className={parentContainer}>
            <Stack className={container} horizontalAlign="center">
                <Stack.Item className={containerInner}>
                    <Stack horizontalAlign="center" horizontal wrap>
                        <Stack.Item className={mr4} grow>
                            <Pivot
                                defaultSelectedKey={defaultKey}
                                className={options}
                                styles={pivotStyles}
                                aria-label="Create or join a meeting"
                            >
                                <PivotItem itemKey="create" headerText="Create new meeting">
                                    <CreateMeeting />
                                </PivotItem>
                                <PivotItem itemKey="join" headerText="Join a meeting">
                                    <JoinMeeting defaultId={defaultId} />
                                </PivotItem>
                            </Pivot>
                        </Stack.Item>
                    </Stack>
                </Stack.Item>
            </Stack>
            <div className={divRooms}>
                <div>
                    <Text className={heading} variant="superLarge">
                        Public Rooms
                    </Text>
                    {rooms?.length > 0 ? rooms.map(room => <Room {...room} key={room.id} />) : null}
                </div>
            </div>
        </div>
    )
}

export default Landing
