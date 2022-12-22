def foo(n,result):
    if n>0:
        result*=n
        return foo(n-1,result)
    else:
        return result

print(foo(5,1))




def voo(n):
    if n==0 or n==1:
        return 1
    else:
        return n*voo(n-1)

print(voo(5))