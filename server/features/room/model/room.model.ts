export enum RoomEvents {
    Register = 'register',
    CreateRoom = 'create_room',
    JoinRoom = 'join_room',
    LeaveRoom = 'leave_room',
    PersonLeft = 'person_left',
    GetRoomsList = 'get_rooms_list',
}

export interface RoomRegisterPayload {
    sessionId: string
    roomId?: string
}
