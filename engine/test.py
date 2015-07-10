import engine


class TestInputOutput(engine.InputOutput):

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


cards = {
    'punch':         engine.CARD('punch',           engine.ACTION(-10,  None)),
    'health potion': engine.CARD('health potition', engine.ACTION(5,    None)),
    'instant death': engine.CARD('instant death',   engine.ACTION(-999, None))
}


def assertPlayer(gamePlayer, name, cards, schedule, health, target):
    assert(gamePlayer.name == name)
    assert(gamePlayer.cards == cards)
    assert(gamePlayer.schedule == schedule)
    assert(gamePlayer.health == health)
    assert(gamePlayer.target == target)


def test2Players(winner, p1health, p2health, inputString):
    players = [engine.PLAYER('PLAYER 1'), engine.PLAYER('PLAYER 2')]
    players[0].acquireCard(cards['punch'])
    players[1].acquireCard(cards['health potion'])

    game = engine.xCard(players, TestInputOutput(inputString))

    assert(len(game.winners) == 1)
    assert(game.winners[0] == game.players[winner])

    assert(game.schedule == engine.SCHEDULE())

    assertPlayer(game.players[0], players[0].name,
                 [], engine.SCHEDULE(), p1health, players[0].target)
    assertPlayer(game.players[1], players[1].name,
                 [], engine.SCHEDULE(), p2health, players[1].target)


def test3Players(winners, p1health, p2health, p3health, inputString):
    players = [engine.PLAYER("PLAYER 1"), engine.PLAYER(
        "PLAYER 2"), engine.PLAYER("PLAYER 3")]
    players[0].acquireCard(cards['punch'])
    players[0].acquireCard(cards['punch'])
    players[1].acquireCard(cards['punch'])
    players[1].acquireCard(cards['health potion'])
    players[2].acquireCard(cards['health potion'])
    players[2].acquireCard(cards['health potion'])

    game = engine.xCard(players, TestInputOutput(inputString))

    assert(len(game.winners) == len(winners))
    for i in range(0, len(winners)):
        index = winners[i] - 1
        assert(game.winners[i] == players[index])

    assert(game.schedule == engine.SCHEDULE())

    assertPlayer(game.players[0], players[0].name,
                 [], engine.SCHEDULE(), p1health, players[0].target)
    assertPlayer(game.players[1], players[1].name,
                 [], engine.SCHEDULE(), p2health, players[1].target)
    assertPlayer(game.players[2], players[2].name,
                 [], engine.SCHEDULE(), p3health, players[2].target)


def test2PlayersOneDies():
    players = [engine.PLAYER('PLAYER 1'), engine.PLAYER('PLAYER 2')]
    players[0].acquireCard(cards['instant death'])
    players[1].acquireCard(cards['health potion'])

    game = engine.xCard(players, TestInputOutput('11n'))

    assert(len(game.winners) == 1)
    assert(game.winners[0] == game.players[1])

    assert(game.schedule == engine.SCHEDULE())

    assertPlayer(
        game.players[0], players[0].name, [], engine.SCHEDULE(), 0, players[0].target)
    assertPlayer(game.players[1], players[1].name, [
                 cards['health potion']], engine.SCHEDULE(), 100, players[1].target)


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

    test2PlayersOneDies()

if __name__ == '__main__':
    main()
