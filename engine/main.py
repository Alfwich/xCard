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
        io.output('{}, please choose your SCHEDULE.'.format(self.name))
        io.output('[n] for nothing.')
        i = 1
        for card in self.cards:
            io.output('[{}] for CARD(\'{}\')'.format(i, card.name))
            i += 1
        io.output('Enter your CARD choice: ', end='')
        cardChoice = io.input()
        if cardChoice == 'n':
            self.schedule = SCHEDULE()
            return

        cardChoiceInt = int(cardChoice)
        cardChoiceIndex = cardChoiceInt - 1
        assert(cardChoiceIndex < len(self.cards))

        io.output('  {}, please choose a TARGET.'.format(self.name))
        i = 1
        for player in players:
            io.output('  [{}] to target {}'.format(i, player.name))
            i += 1
        io.output('  Enter your TARGET choice: ', end='')
        targetChoice = io.input()
        targetChoiceInt = int(targetChoice)

        newACTION = self.cards[cardChoiceIndex].action
        newACTION.target = players[
            targetChoiceInt - 1].target

        self.schedule.addAction(self.cards[cardChoiceIndex].action)
        del self.cards[cardChoiceIndex]

    def acquireCard(self, card):
        self.cards.append(card)


class CARD:

    def __init__(self, name, action):
        self.name = name
        self.action = action


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
            io.output('{} has {} health.'.format(player.name, player.health))

    def applyACTIONToTARGET(self, action):
        for player in self.players:
            if player.target == action.target:
                player.health += action.healthDelta

    def applySchedule(self):
        while self.schedule.actions:
            action = self.schedule.actions.pop()
            assert(action.target != None)
            self.applyACTIONToTARGET(action)

    def chooseSchedules(self, io):
        for player in self.players:
            player.chooseSchedule(self.players, io)
            io.output('{}.schedule = {}'.format(player.name, player.schedule))
            self.schedule.actions.extend(player.schedule.actions)
            player.schedule = SCHEDULE()


class InputOutput:

    @staticmethod
    def input():
        raise NotImplementedError()

    @staticmethod
    def output(msg, end):
        raise NotImplementedError()


def xCard(players, io):
    for player in players:
        io.output('PLAYER: {}'.format(player.name))
        for card in player.cards:
            io.output('  CARD: {}'.format(card.name))

    # todo decide to not redraw

    game = GAME(players)

    turnNumber = 1
    while not game.isOver():
        io.output('\n===Turn {} begins==='.format(turnNumber))
        game.printPlayersHealths(io)
        game.chooseSchedules(io)
        game.applySchedule()
        turnNumber += 1

    io.output('{} is the list of WINNERS.'.format(game.computerWinners()))

    return game

import copy


class TestInputOutput(InputOutput):

    def __init__(self, inputString):
        self.inputString = inputString

    def input(self):
        assert(len(self.inputString) > 0)
        first = self.inputString[0]
        self.inputString = self.inputString[1:]
        return first

    @staticmethod
    def output(msg, end='\n'):
        pass


actions = [ACTION(-10, None), ACTION(5, None)]
cards = {'punch': CARD('Punch', actions[0]), 'health potion': CARD(
    'Health Potition', actions[1])}


def test2Players(winner, p1health, p2health, inputString):
    players = [PLAYER('PLAYER 1'), PLAYER('PLAYER 2')]
    players[0].acquireCard(cards['punch'])
    players[1].acquireCard(cards['health potion'])

    game = xCard(players, TestInputOutput(inputString))

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


def test3Players(winners, p1health, p2health, p3health, inputString):
    players = [PLAYER("PLAYER 1"), PLAYER("PLAYER 2"), PLAYER("PLAYER 3")]
    players[0].acquireCard(cards['punch'])
    players[0].acquireCard(cards['punch'])
    players[1].acquireCard(cards['punch'])
    players[1].acquireCard(cards['health potion'])
    players[2].acquireCard(cards['health potion'])
    players[2].acquireCard(cards['health potion'])

    game = xCard(players, TestInputOutput(inputString))

    assert(len(game.winners) == len(winners))
    for i in range(0, len(winners)):
        index = winners[i] - 1
        assert(game.winners[i] == players[index])

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

    assert(game.players[2].name == players[2].name)
    assert(game.players[2].cards == [])
    assert(game.players[2].schedule == SCHEDULE())
    assert(game.players[2].health == p3health)
    assert(game.players[2].target == players[2].target)


def main():
    # Tests cases below are all 'equivalent games', except there are added
    # 'null actions'.
    test2Players(1, 95, 100, '1111')
    test2Players(1, 95, 100, 'nn1111')
    test2Players(1, 95, 100, 'n1111n')
    test2Players(1, 95, 100, 'nnnnn11nn11n')

    # The cases below are all different games.
    test2Players(0, 100, 95, '12nnnn12')
    test2Players(0, 105, 90, 'nnnn1211')
    test2Players(1, 90, 105, 'nn1112nn')

    test3Players([2, 3], 85, 100, 100, 'nnn' + '111111' + '111111')

if __name__ == '__main__':
    main()
