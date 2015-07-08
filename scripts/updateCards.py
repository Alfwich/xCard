import sys, os, urllib2, generateCards

def meteorIsOn( url, port):
  result = False

  try:
    response = urllib2.urlopen('http://%s:%s'%(url,str(port)), timeout=1)
    result = True
  except urllib2.URLError as err:
    pass

  return result

def main():
    host = "localhost"
    port = 3001
    if len(sys.argv) == 2:
        port = sys.argv[1]

    if meteorIsOn( host, port ):
        print( "Generating cards" )
        generateCards.main()
        print( "Importing cards into database" )
        os.system( "mongoimport -h %s:%s --drop --db meteor --collection Cards --type json --file cards.json --jsonArray" % (host,str(port)) )
        print( "Done" )
    else:
        print( "Could not connect to the Meteor server. It needs to be running to insert the data." )



if __name__ == "__main__":
    main()
