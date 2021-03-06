/*
* Show only the cards that are assigned to current user
*/
const [myUserId, allCards] = await Promise.all([
    miro.currentUser.getId(),
    miro.board.widgets.get({ type: 'CARD' })
])
const _storeKey = 'filter-cards-by-current-user'
const isFilterApplied = () => (localStorage.getItem(_storeKey) === true)
const markFilterApplied = () => localStorage.setItem(_storeKey, true)
const unmarkFilterApplied = () => localStorage.removeItem(_storeKey)

if (!isFilterApplied()) {
    const cardsToHide = allCards
        .filter(card => !card.assignee || card.assignee.userId !== myUserId)

    await miro.board.widgets
        .update(cardsToHide.map(card => ({ id: card.id, clientVisible: false })))

    markFilterApplied()

} else {
    // if there's already a filter applied - clear it
    await miro.board.widgets
        .update(allCards.map(card => ({ id: card.id, clientVisible: true })))

    unmarkFilterApplied()
}
