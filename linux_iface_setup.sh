#Move VMWare wmnet inerfaces out of the way.

sudo ip addr del 10.7.10.1/24 dev vmnet1
sudo ip addr del 10.7.20.1/24 dev vmnet2
sudo ip addr del 10.7.30.1/24 dev vmnet3
sudo ip addr del 10.7.100.1/24 dev vmnet4
sudo ip addr del 10.5.100.1/24 dev vmnet5
sudo ip addr del 10.7.0.1/24 dev vmnet8

sudo ip addr add 10.7.10.201/24 dev vmnet1
sudo ip addr add 10.7.20.201/24 dev vmnet2
sudo ip addr add 10.7.30.201/24 dev vmnet3
sudo ip addr add 10.7.100.201/24 dev vmnet4
sudo ip addr add 10.5.100.201/24 dev vmnet5
sudo ip addr add 10.7.0.1/8 dev vmnet8
