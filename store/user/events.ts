import { Module, VuexAction, VuexModule, VuexMutation } from 'nuxt-property-decorator'
import { v4 } from 'uuid'
import { $storage } from '~/utils/api'
import Event from '~/model/Event'

@Module({
  namespaced: true
})
export default class Config extends VuexModule {
  public items: Array<any>= []

  @VuexMutation
  public SET_ITEMS (items:any) {
    this.items = items
  }

  @VuexMutation
  public ADD_ITEM (item:any) {
    this.items.push(Object.assign(new Event(0,
      '', '', '', '',
      '', '', '', ''), item))
  }

  @VuexMutation
  public DELETE_ITEM_BY_INDEX (index: any) {
    this.items.splice(index, 1)
  }

  @VuexMutation
  public UPDATE_ITEM_BY_INDEX ({ index, item }: any) {
    this.items = this.items.map((c, i) => i === index ? item : c)
  }

  @VuexAction
  public saveNewItem (item: any) {
    this.context.commit('ADD_ITEM', item)
    $storage.setLocalStorage('myEvents', this.items)
  }

  @VuexAction
  public deleteItemById (id: any) {
    const index = this.items.findIndex(s => s.id === id)
    this.context.commit('DELETE_ITEM_BY_INDEX', index)
    $storage.setLocalStorage('myEvents', this.items)
  }

  @VuexAction
  public updateItem (item: any) {
    const index = this.items.findIndex(s => s.id === item.id)
    if (index >= 0) {
      this.context.commit(
        'UPDATE_ITEM_BY_INDEX',
        {
          index,
          item
        })
      $storage.setLocalStorage('myEvents', this.items)
    } else {
      console.error(index)
    }
  }

  @VuexAction
  public updateItems (items: any) {
    this.context.commit('SET_ITEMS', items)
    $storage.setLocalStorage('myEvents', this.items)
  }

  @VuexAction({ commit: 'SET_ITEMS' })
  public fetchItems () {
    const events = $storage.getLocalStorage('myEvents') || []
    return events.map((e: any) => Object.assign(
      new Event(0, '', '', '', '', '', '', '', ''),
      e, { id: e?.id || v4() }))
  }
}
