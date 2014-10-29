import sys, re

file = open(sys.argv[1], 'r')

result = file.read()

file.close()

pattern = re.compile('"media/(.*?)"')


for i,m in enumerate(pattern.finditer(result)):
	string = m.group()[7:]
	result = result.replace('"media/' + string, '"{% static "' + string + ' %}" ')

file = open(sys.argv[1], 'w+')
file.write(result)

file.close()
