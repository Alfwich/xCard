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
        self.turnNumber = 1

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

    def turnBegins(self, io):
        io.output('\n===Turn {} begins==='.format(self.turnNumber))
        for player in self.players:
            io.output('{} has {} health.'.format(player.name, player.health))

    def applyACTIONToTARGET(self, action):
        for player in self.players:
            if player.target == action.target:
                player.health = max(0, player.health + action.healthDelta)

    def turnEnds(self):
        while self.schedule.actions:
            action = self.schedule.actions.pop()
            assert(action.target != None)
            self.applyACTIONToTARGET(action)

        self.turnNumber += 1

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
    while not game.isOver():
        game.turnBegins(io)
        game.chooseSchedules(io)
        game.turnEnds()

    io.output('{} is the list of WINNERS.'.format(game.computerWinners()))

    return game