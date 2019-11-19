/*
* Show only the cards that are assigned to current user
*/
const myUserId = await miro.currentUser.getId()
const allCards = await miro.board.widgets.get({ type: 'CARD' })
const storeKey = 'filter-cards-by-current-user'

if (!localStorage.getItem(storeKey)) {
    // no existing filter applied
    const cardsToHide = allCards
        .filter(card => !card.assignee || card.assignee.userId !== myUserId)

    await miro.board.widgets
        .update(cardsToHide.map(card => ({ id: card.id, clientVisible: false })))

    localStorage.setItem(storeKey, true)

} else {
    // if there's already a filter applied - clear it
    await miro.board.widgets
        .update(allCards.map(card => ({ id: card.id, clientVisible: true })))

    localStorage.removeItem(storeKey)
}
