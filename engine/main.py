class TARGET:
    nextUniqueIdentifier = 1

    @classmethod
    def newUniqueIdentifier(cls):
        newUID = cls.nextUniqueIdentifier
        cls.nextUniqueIdentifier += 1
        return newUID

    def __init__(self):
        self.uniqueIdentifier = TARGET.newUniqueIdentifier()


class Player:

    def __init__(self, name):
        self.name = name
        self.cards = []
        self.schedule = []
        self.health = 100
        self.TARGET = TARGET()

    def chooseSchedule(self, players):
        print("{}, please choose your SCHEDULE.".format(self.name))
        print("[n] for nothing.")
        i = 1
        for card in self.cards:
            print("[{}] for CARD(\"{}\")".format(i, card.name))
            i += 1
        cardChoice = input("Enter your CARD choice: ")
        if cardChoice == "n":
            self.schedule = []
            return

        cardChoiceInt = int(cardChoice)
        cardChoiceIndex = cardChoiceInt - 1

        print("  {}, please choose a TARGET.".format(self.name))
        i = 1
        for player in players:
            print("  [{}] to target {}".format(i, player.name))
            i += 1
        targetChoice = input("  Enter your TARGET choice: ")
        targetChoiceInt = int(targetChoice)
        self.cards[cardChoiceIndex].TARGET = players[
            targetChoiceInt - 1].TARGET

        self.schedule = [self.cards[cardChoiceIndex]]
        del self.cards[cardChoiceIndex]

    def acquireCard(self, card):
        self.cards.append(card)


class Card:

    def __init__(self, name, healthDelta):
        self.name = name
        self.healthDelta = healthDelta
        self.TARGET = None


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

    def winners(self):
        winners = []
        maxHealthSeen = -1
        for player in self.players:
            if player.health > maxHealthSeen:
                maxHealthSeen = player.health
                winners = [player.name]
            elif player.health == maxHealthSeen:
                winners.append(player.name)

        return winners

    def printPlayersHealths(self):
        for player in self.players:
            print("{} has {} health.".format(player.name, player.health))

    def applyCardToTargetPlayer(self, card):
        for player in self.players:
            if player.TARGET == card.TARGET:
                player.health += card.healthDelta

    def applySchedule(self, schedule):
        for card in schedule:
            assert(card.TARGET != None)
            self.applyCardToTargetPlayer(card)


def main():
    players = [Player("Alan"), Player("Betty")]

    players[0].acquireCard(Card("Punch", -10))
    players[1].acquireCard(Card("Health Potion", 5))

    for player in players:
        print("PLAYER: {}".format(player.name))
        for card in player.cards:
            print("  CARD: {}".format(card.name))

    # decide to not redraw

    game = Game(players)

    turnNumber = 1
    while True:
        print("\n===Turn {} begins===".format(turnNumber))
        game.printPlayersHealths()
        if game.isOver():
            print("{} is the list of WINNERS.".format(game.winners()))
            break

        gameSchedule = []
        for player in players:
            player.chooseSchedule(players)
            print("{}.schedule = {}".format(player.name, player.schedule))
            gameSchedule.extend(player.schedule)

        game.applySchedule(gameSchedule)

        turnNumber += 1

if __name__ == "__main__":
    main()
