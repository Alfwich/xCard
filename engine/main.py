class TARGET:
    nextUniqueIdentifier = 1

    @classmethod
    def newUniqueIdentifier(cls):
        newUID = cls.nextUniqueIdentifier
        cls.nextUniqueIdentifier += 1
        return newUID

    def __init__(self):
        self.uniqueIdentifier = TARGET.newUniqueIdentifier()


class ACTION:

    def __init__(self, healthDelta, incTARGET):
        self.healthDelta = healthDelta
        self.TARGET = incTARGET


class SCHEDULE:

    def __init__(self):
        self.ACTIONS = []

    def addAction(self, incACTION):
        self.ACTIONS.append(incACTION)


class Player:

    def __init__(self, name):
        self.name = name
        self.cards = []
        self.SCHEDULE = SCHEDULE()
        self.health = 100
        self.TARGET = TARGET()

    def chooseSchedule(self, players, inputCallbacks):
        print("{}, please choose your SCHEDULE.".format(self.name))
        print("[n] for nothing.")
        i = 1
        for card in self.cards:
            print("[{}] for CARD(\"{}\")".format(i, card.name))
            i += 1
        print("Enter your CARD choice: ", end="")
        cardChoice = inputCallbacks.getInput()
        if cardChoice == "n":
            self.SCHEDULE = SCHEDULE()
            return

        cardChoiceInt = int(cardChoice)
        cardChoiceIndex = cardChoiceInt - 1
        assert(cardChoiceIndex < len(self.cards))

        print("  {}, please choose a TARGET.".format(self.name))
        i = 1
        for player in players:
            print("  [{}] to target {}".format(i, player.name))
            i += 1
        print("  Enter your TARGET choice: ", end="")
        targetChoice = inputCallbacks.getInput()
        targetChoiceInt = int(targetChoice)

        newACTION = self.cards[cardChoiceIndex].ACTION
        newACTION.TARGET = players[
            targetChoiceInt - 1].TARGET

        self.SCHEDULE.addAction(self.cards[cardChoiceIndex].ACTION)
        del self.cards[cardChoiceIndex]

    def acquireCard(self, card):
        self.cards.append(card)


class CARD:

    def __init__(self, name, incACTION):
        self.name = name
        self.ACTION = incACTION


class Game:

    def __init__(self, players):
        self.players = players
        self.SCHEDULE = SCHEDULE()
        self.WINNER = []

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
        self.WINNER = []
        maxHealthSeen = -1
        for player in self.players:
            if player.health > maxHealthSeen:
                maxHealthSeen = player.health
                self.WINNER = [player.name]
            elif player.health == maxHealthSeen:
                self.WINNER.append(player.name)

        return self.WINNER

    def printPlayersHealths(self):
        for player in self.players:
            print("{} has {} health.".format(player.name, player.health))

    def applyACTIONToTARGET(self, incACTION):
        for player in self.players:
            if player.TARGET == incACTION.TARGET:
                player.health += incACTION.healthDelta

    def applySchedule(self):
        for incACTION in self.SCHEDULE.ACTIONS:
            assert(incACTION.TARGET != None)
            self.applyACTIONToTARGET(incACTION)


class InputCallbacks:

    @staticmethod
    def getInput():
        raise NotImplementedError()


class STDINInputCallbacks(InputCallbacks):

    @staticmethod
    def getInput():
        return input()


class AllOnesInputCallbacks(InputCallbacks):

    @staticmethod
    def getInput():
        return "1"


def xCard(players, inputCallbacks):
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

        for player in players:
            player.chooseSchedule(players, inputCallbacks)
            print("{}.SCHEDULE = {}".format(player.name, player.SCHEDULE))
            game.SCHEDULE.ACTIONS.extend(player.SCHEDULE.ACTIONS)

        game.applySchedule()
        game.SCHEDULE = SCHEDULE()

        turnNumber += 1

    return Game

import copy


def main():
    players = [Player("Alan"), Player("Betty")]
    actions = [ACTION(-10, None), ACTION(5, None)]
    cards = [CARD("Punch", actions[0]), CARD("Health Potition", actions[1])]

    players[0].acquireCard(cards[0])
    players[1].acquireCard(cards[1])

    print(xCard(copy.deepcopy(players), AllOnesInputCallbacks))
    print(xCard(copy.deepcopy(players), STDINInputCallbacks))

if __name__ == "__main__":
    main()
