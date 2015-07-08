class Player:

    def __init__(self, name):
        self.name = name
        self.cards = []
        self.schedule = []
        self.health = 100

    def chooseSchedule(self, players):
        print("{}, please choose your schedule.".format(self.name))
        print("[n] for nothing.")
        i = 1
        for card in self.cards:
            print("[{}] for Card(\"{}\")".format(i, card.name))
            i += 1
        cardChoice = input("Enter your card choice: ")
        if cardChoice == "n":
            self.schedule = []
            return

        cardChoiceInt = int(cardChoice)
        cardChoiceIndex = cardChoiceInt - 1

        print("{}, please choose a target.".format(self.name))
        i = 1
        for player in players:
            print("[{}] to target {}".format(i, player.name))
            i += 1
        targetChoice = input("Enter your target choice: ")
        targetChoiceInt = int(targetChoice)
        self.cards[cardChoiceIndex].target = targetChoiceInt - 1

        self.schedule = [self.cards[cardChoiceIndex]]
        del self.cards[cardChoiceIndex]

    def addCardToHand(self, card):
        self.cards.append(card)


class Card:

    def __init__(self, name, healthDelta):
        self.name = name
        self.healthDelta = healthDelta
        self.target = None


class Game:

    def __init__(self, players):
        self.players = players

    def isOver(self):
        actionPossible = False

        for player in self.players:
            if player.cards != []:
                actionPossible = True

        if not actionPossible:
            return True

        alivePlayers = 0
        for player in self.players:
            if player.health > 0:
                alivePlayers += 1

        if alivePlayers <= 1:
            return True

        return False

    def winner(self):
        winners = []
        maxHealthSeen = -1
        for player in self.players:
            if player.health > maxHealthSeen:
                maxHealthSeen = player.health
                winners = [player]
            elif player.health == maxHealthSeen:
                winners.append(player)

        return winners

    def printPlayersHealths(self):
        for player in self.players:
            print("{} has {} health.".format(player.name, player.health))


def main():
    players = [Player("Alan"), Player("Betty")]

    players[0].addCardToHand(Card("Punch", -10))
    players[1].addCardToHand(Card("Health Potion", 5))

    for player in players:
        print("Player: {}".format(player.name))
        for card in player.cards:
            print("  Card: {}".format(card.name))

    # decide to not redraw

    game = Game(players)

    turnNumber = 1
    while True:
        print("\n===Turn {} begins===".format(turnNumber))
        game.printPlayersHealths()
        if game.isOver():
            print("{} is the list of winners.".format(game.winner()))
            break

        for player in players:
            player.chooseSchedule(players)
            print("{}.schedule = {}".format(player.name, player.schedule))

        turnNumber += 1

if __name__ == "__main__":
    main()
