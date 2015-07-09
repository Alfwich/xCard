class TARGET:
    nextUniqueIdentifier = 1

    @classmethod
    def newUniqueIdentifier(cls):
        newUID = cls.nextUniqueIdentifier
        cls.nextUniqueIdentifier += 1
        return newUID

    def __init__(self):
        self.uniqueIdentifier = TARGET.newUniqueIdentifier()

    def __eq__(self, other):
        return type(other) is TARGET and self.uniqueIdentifier == other.uniqueIdentifier


class ACTION:

    def __init__(self, healthDelta, incTARGET):
        self.healthDelta = healthDelta
        self.TARGET = incTARGET


class SCHEDULE:

    def __init__(self):
        self.ACTIONS = []

    def __eq__(self, other):
        return self.ACTIONS == other.ACTIONS

    def addAction(self, incACTION):
        self.ACTIONS.append(incACTION)


class Player:

    def __init__(self, name):
        self.name = name
        self.cards = []
        self.SCHEDULE = SCHEDULE()
        self.health = 100
        self.TARGET = TARGET()

    def chooseSchedule(self, players, inputCallbacks, outputCallbacks):
        outputCallbacks.out(
            "{}, please choose your SCHEDULE.".format(self.name))
        outputCallbacks.out("[n] for nothing.")
        i = 1
        for card in self.cards:
            outputCallbacks.out("[{}] for CARD(\"{}\")".format(i, card.name))
            i += 1
        outputCallbacks.out("Enter your CARD choice: ", end="")
        cardChoice = inputCallbacks.getInput()
        if cardChoice == "n":
            self.SCHEDULE = SCHEDULE()
            return

        cardChoiceInt = int(cardChoice)
        cardChoiceIndex = cardChoiceInt - 1
        assert(cardChoiceIndex < len(self.cards))

        outputCallbacks.out("  {}, please choose a TARGET.".format(self.name))
        i = 1
        for player in players:
            outputCallbacks.out("  [{}] to target {}".format(i, player.name))
            i += 1
        outputCallbacks.out("  Enter your TARGET choice: ", end="")
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
        self.WINNERS = []

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
        self.WINNERS = []
        maxHealthSeen = -1
        for player in self.players:
            if player.health > maxHealthSeen:
                maxHealthSeen = player.health
                self.WINNERS = [player]
            elif player.health == maxHealthSeen:
                self.WINNERS.append(player)

        return self.WINNERS

    def printPlayersHealths(self, outputCallbacks):
        for player in self.players:
            outputCallbacks.out(
                "{} has {} health.".format(player.name, player.health))

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


class OutputCallbacks:

    @staticmethod
    def out(msg, end):
        raise NotImplementedError()


def xCard(players, inputCallbacks, outputCallbacks):
    for player in players:
        outputCallbacks.out("PLAYER: {}".format(player.name))
        for card in player.cards:
            outputCallbacks.out("  CARD: {}".format(card.name))

    # decide to not redraw

    game = Game(players)

    turnNumber = 1
    while True:
        outputCallbacks.out("\n===Turn {} begins===".format(turnNumber))
        game.printPlayersHealths(outputCallbacks)
        if game.isOver():
            outputCallbacks.out(
                "{} is the list of WINNERS.".format(game.winners()))
            break

        for player in players:
            player.chooseSchedule(players, inputCallbacks, outputCallbacks)
            outputCallbacks.out(
                "{}.SCHEDULE = {}".format(player.name, player.SCHEDULE))
            game.SCHEDULE.ACTIONS.extend(player.SCHEDULE.ACTIONS)
            player.SCHEDULE = SCHEDULE()

        game.applySchedule()
        game.SCHEDULE = SCHEDULE()

        turnNumber += 1

    return game

import copy


actions = [ACTION(-10, None), ACTION(5, None)]
cards = [CARD("Punch", actions[0]), CARD("Health Potition", actions[1])]


class ListInputCallbacks(InputCallbacks):

    def __init__(self, inputList):
        self.inputList = inputList

    def getInput(self):
        assert(len(self.inputList) > 0)
        return self.inputList.pop(0)


class IgnoredOutputCallbacks(OutputCallbacks):

    @staticmethod
    def out(msg, end="\n"):
        pass


def test2Players(winner, p1health, p2health, inputList):
    players = [Player("Player 1"), Player("Player 2")]
    players[0].acquireCard(cards[0])
    players[1].acquireCard(cards[1])

    game = xCard(
        players, ListInputCallbacks(inputList), IgnoredOutputCallbacks)

    assert(len(game.WINNERS) == 1)
    assert(game.WINNERS[0] == game.players[winner])

    assert(game.SCHEDULE == SCHEDULE())

    assert(game.players[0].name == players[0].name)
    assert(game.players[0].cards == [])
    assert(game.players[0].SCHEDULE == SCHEDULE())
    assert(game.players[0].health == p1health)
    assert(game.players[0].TARGET == players[0].TARGET)

    assert(game.players[1].name == players[1].name)
    assert(game.players[1].cards == [])
    assert(game.players[1].SCHEDULE == SCHEDULE())
    assert(game.players[1].health == p2health)
    assert(game.players[1].TARGET == players[1].TARGET)


def main():
    # Tests cases below are all "equivalent games", except there are added
    # "null actions".
    test2Players(1, 95, 100, ['1', '1', '1', '1'])
    test2Players(1, 95, 100, ['n', 'n', '1', '1', '1', '1'])
    test2Players(1, 95, 100, ['n', '1', '1', '1', '1', 'n'])
    test2Players(
        1, 95, 100, ['n', 'n', 'n', 'n', 'n', '1', '1', 'n', 'n', '1', '1', 'n'])

    # The cases below are all different games.
    test2Players(0, 100, 95, ['1', '2', 'n', 'n', 'n', 'n', '1', '2'])
    test2Players(0, 105, 90, ['n', 'n', 'n', 'n', '1', '2', '1', '1'])
    test2Players(1, 90, 105, ['n', 'n', '1', '1', '1', '2', 'n', 'n'])

if __name__ == "__main__":
    main()
