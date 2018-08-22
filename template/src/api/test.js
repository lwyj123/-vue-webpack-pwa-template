import fetch from 'utils/fetch'
// import store from 'store'


export function test () {
  return fetch({
    url: `/test`,
    method: 'get'
  })
}