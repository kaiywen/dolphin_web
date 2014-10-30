import sys, re

if len(sys.argv) != 2:
	sys.stderr.write("Incorrect Parameter")
	raise SystemExit(1)

"media/image/menu-toggler.png"

file = open(sys.argv[1], 'r')

result = file.read()

file.close()

pattern = re.compile('"media/(.*?)" ')


for i,m in enumerate(pattern.finditer(result)):
	string = m.group()[7:]
	result = result.replace('"media/' + string, '"{% static "' + string + '%}" ')

file = open(sys.argv[1], 'w+')
file.write(result)

file.close()
