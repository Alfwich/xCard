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

    def __init__(self, healthDelta, target):
        self.healthDelta = healthDelta
        self.target = target


class SCHEDULE:

    def __init__(self):
        self.actions = []

    def __eq__(self, other):
        return self.actions == other.actions

    def addAction(self, action):
        self.actions.append(action)


class PLAYER:

    def __init__(self, name):
        self.name = name
        self.cards = []
        self.schedule = SCHEDULE()
        self.health = 100
        self.target = TARGET()

    def chooseSchedule(self, players, io):
        io.output("{}, please choose your SCHEDULE.".format(self.name))
        io.output("[n] for nothing.")
        i = 1
        for card in self.cards:
            io.output("[{}] for CARD(\"{}\")".format(i, card.name))
            i += 1
        io.output("Enter your CARD choice: ", end="")
        cardChoice = io.input()
        if cardChoice == "n":
            self.schedule = SCHEDULE()
            return

        cardChoiceInt = int(cardChoice)
        cardChoiceIndex = cardChoiceInt - 1
        assert(cardChoiceIndex < len(self.cards))

        io.output("  {}, please choose a TARGET.".format(self.name))
        i = 1
        for player in players:
            io.output("  [{}] to target {}".format(i, player.name))
            i += 1
        io.output("  Enter your TARGET choice: ", end="")
        targetChoice = io.input()
        targetChoiceInt = int(targetChoice)

        newACTION = self.cards[cardChoiceIndex].ACTION
        newACTION.target = players[
            targetChoiceInt - 1].target

        self.schedule.addAction(self.cards[cardChoiceIndex].ACTION)
        del self.cards[cardChoiceIndex]

    def acquireCard(self, card):
        self.cards.append(card)


class CARD:

    def __init__(self, name, action):
        self.name = name
        self.ACTION = action


class GAME:

    def __init__(self, players):
        self.players = players
        self.schedule = SCHEDULE()
        self.winners = []

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

    def computerWinners(self):
        self.winners = []
        maxHealthSeen = -1
        for player in self.players:
            if player.health > maxHealthSeen:
                maxHealthSeen = player.health
                self.winners = [player]
            elif player.health == maxHealthSeen:
                self.winners.append(player)

        return self.winners

    def printPlayersHealths(self, io):
        for player in self.players:
            io.output("{} has {} health.".format(player.name, player.health))

    def applyACTIONToTARGET(self, action):
        for player in self.players:
            if player.target == action.target:
                player.health += action.healthDelta

    def applySchedule(self):
        for action in self.schedule.actions:
            assert(action.target != None)
            self.applyACTIONToTARGET(action)


class InputOutput:

    @staticmethod
    def input():
        raise NotImplementedError()

    @staticmethod
    def output(msg, end):
        raise NotImplementedError()


def xCard(players, io):
    for player in players:
        io.output("PLAYER: {}".format(player.name))
        for card in player.cards:
            io.output("  CARD: {}".format(card.name))

    # todo decide to not redraw

    game = GAME(players)

    turnNumber = 1
    while True:
        io.output("\n===Turn {} begins===".format(turnNumber))
        game.printPlayersHealths(io)
        if game.isOver():
            io.output(
                "{} is the list of WINNERS.".format(game.computerWinners()))
            break

        for player in players:
            player.chooseSchedule(players, io)
            io.output("{}.schedule = {}".format(player.name, player.schedule))
            game.schedule.actions.extend(player.schedule.actions)
            player.schedule = SCHEDULE()

        game.applySchedule()
        game.schedule = SCHEDULE()

        turnNumber += 1

    return game

import copy


class TestInputOutput(InputOutput):

    def __init__(self, inputList):
        self.inputList = inputList

    def input(self):
        assert(len(self.inputList) > 0)
        return self.inputList.pop(0)

    @staticmethod
    def output(msg, end="\n"):
        pass


def test2Players(winner, p1health, p2health, inputList):
    actions = [ACTION(-10, None), ACTION(5, None)]
    cards = [CARD("Punch", actions[0]), CARD("Health Potition", actions[1])]

    players = [PLAYER("PLAYER 1"), PLAYER("PLAYER 2")]
    players[0].acquireCard(cards[0])
    players[1].acquireCard(cards[1])

    game = xCard(players, TestInputOutput(inputList))

    assert(len(game.winners) == 1)
    assert(game.winners[0] == game.players[winner])

    assert(game.schedule == SCHEDULE())

    assert(game.players[0].name == players[0].name)
    assert(game.players[0].cards == [])
    assert(game.players[0].schedule == SCHEDULE())
    assert(game.players[0].health == p1health)
    assert(game.players[0].target == players[0].target)

    assert(game.players[1].name == players[1].name)
    assert(game.players[1].cards == [])
    assert(game.players[1].schedule == SCHEDULE())
    assert(game.players[1].health == p2health)
    assert(game.players[1].target == players[1].target)


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
