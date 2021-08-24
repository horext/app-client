import { Module, VuexAction, VuexModule, VuexMutation } from 'nuxt-property-decorator'
import { $storage } from '~/utils/api'

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
    this.items.push(Object.assign({}, item))
  }

  @VuexMutation
  public DELETE_ITEM_BY_INDEX (index: any) {
    this.items.splice(index, 1)
  }

  @VuexMutation
  public UPDATE_ITEM_BY_INDEX ({ index, ITEM }: any) {
    this.items = this.items.map((c, i) => i === index ? ITEM : c)
  }

  @VuexAction
  public saveNewItem (item: any) {
    this.context.commit('ADD_ITEM', item)
    $storage.setLocalStorage('mySubjects', this.items)
  }

  @VuexAction
  public deleteItemById (id: any) {
    const index = this.items.findIndex(s => s.id === id)
    this.context.commit('DELETE_ITEM_BY_INDEX', index)
    $storage.setLocalStorage('mySubjects', this.items)
  }

  @VuexAction
  public updateItem (item: any) {
    const index = this.items.findIndex(s => s.id === item.id)
    this.context.commit(
      'UPDATE_ITEM_BY_INDEX',
      {
        index, item
      })
    $storage.setLocalStorage('mySubjects', this.items)
  }

  @VuexAction
  public updateItems (items: any) {
    this.context.commit('SET_ITEMS', items)
    $storage.setLocalStorage('mySubjects', this.items)
  }

  @VuexAction({ commit: 'SET_ITEMS' })
  public fetchItems () {
    return $storage.getLocalStorage('mySubjects') || []
  }
}
