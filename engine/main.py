class Player:

    def __init__(self, name):
        self.name = name
        self.cards = []

    def addCardToHand(self, card):
        self.cards.append(card)


class Card:

    def __init__(self, name):
        self.name = name


class Game:

    def __init__(self, players):
        self.players = players


def main():
    players = [Player("Alan"), Player("Betty")]

    for player in players:
        player.addCardToHand(Card("Punch"))

    for player in players:
        print("Player: {}".format(player.name))
        for card in player.cards:
            print("  Card: {}".format(card.name))

    # decide to not redraw

    game = Game(players)

if __name__ == "__main__":
    main()
