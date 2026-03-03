import http from './http'

class RoomsApi {
  list() {
    return http.get('/rooms')
  }

  detail(roomId) {
    return http.get(`/rooms/${roomId}`)
  }

  create(payload) {
    return http.post('/rooms', payload)
  }

  update(roomId, payload) {
    return http.patch(`/rooms/${roomId}`, payload)
  }

  remove(roomId) {
    return http.delete(`/rooms/${roomId}`)
  }

  join(payload) {
    return http.post('/rooms/join', payload)
  }

  removeMember(roomId, memberId) {
    return http.delete(`/rooms/${roomId}/members/${memberId}`)
  }

  leave(roomId) {
    return http.delete(`/rooms/${roomId}/leave`)
  }
}

export const roomsApi = new RoomsApi()
