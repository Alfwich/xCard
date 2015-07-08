class Player:

    def __init__(self, name):
        self.name = name
        self.cards = []
        self.schedule = []

    def chooseSchedule(self):
        print("{}, please choose your schedule.".format(self.name))
        print("[n] for nothing.")
        i = 1
        for card in self.cards:
            print("[{}] for Card(\"{}\")".format(i, card.name))
            ++i
        choice = input("Enter your choice: ")
        if choice == "n":
            self.schedule = []
            return

        choiceInt = int(choice)
        choiceIndex = choiceInt - 1
        self.schedule = [self.cards[choiceIndex]]
        del self.cards[choiceIndex]

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

    players[0].addCardToHand(Card("Punch"))
    players[1].addCardToHand(Card("Health Potion"))

    for player in players:
        print("Player: {}".format(player.name))
        for card in player.cards:
            print("  Card: {}".format(card.name))

    # decide to not redraw

    game = Game(players)

    while True:
        for player in players:
            player.chooseSchedule()
            print("{}.schedule = {}".format(player.name, player.schedule))
        break

if __name__ == "__main__":
    main()
