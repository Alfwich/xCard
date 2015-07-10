import engine


class PlayInputOutput(engine.InputOutput):

    @staticmethod
    def input():
        return input()

    @staticmethod
    def output(msg, end='\n'):
        print(msg, end=end)

cards = {
    'punch':         engine.CARD('punch',           engine.ACTION(-10,  None)),
    'health potion': engine.CARD('health potition', engine.ACTION(5,    None))
}


def main():
    players = [engine.PLAYER('Alan'), engine.PLAYER('Betty')]
    players[0].acquireCard(cards['punch'])
    players[1].acquireCard(cards['health potion'])
    engine.xCard(players, PlayInputOutput)

if __name__ == '__main__':
    main()
