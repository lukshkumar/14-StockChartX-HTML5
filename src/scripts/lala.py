def mstoS(n):
    return n/1000


def mstoM(n):
    return mstoS(n)/60


def mstoH(n):
    return mstoM(n)/60


def mstoD(n):
    return mstoH(n)/24


def mstoM30(n):
    return mstoD(n)/30


def mstoM31(n):
    return mstoD(n)/31


def mstoY(n):
    return mstoD(n)/365


def YtoMS(n):
    return n*365*24*60*60*1000


def MtoMS30(n):
    return n*30*24*60*60*1000

def func(v):
    if v % 2629743830 == 0:
        diff = v % MtoMS30(1)
        f = v - diff
        print("Months:",int(mstoM30(f)))
    elif v%31556926000==0:
        diff = v % YtoMS(1)
        f = v - diff
        print("Years:",int(mstoY(f)))
        
func(31556926000*2)

""" print("",YtoMS(1),"\n 31556926000\n",YtoMS(1)-31556926000)
print(2629743830) """
