# Benches

## Append

```rst
 ✓ src/string.bench.ts (12) 7463ms
   ✓ string append for round: 1000 (4) 2578ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · String Apppend  75,397.42  0.0086  1.1180  0.0133  0.0103  0.0913  0.1891  0.3241  ±1.81%    37699   fastest
   · Array Join      44,673.77  0.0172  1.3612  0.0224  0.0190  0.0747  0.1133  0.3608  ±1.34%    22337
   · String Concat   70,163.17  0.0085  4.5635  0.0143  0.0148  0.0542  0.1311  0.4038  ±2.90%    35120
   · Array Reduce    35,237.96  0.0198  9.3410  0.0284  0.0230  0.1011  0.2695  0.4707  ±4.93%    17619   slowest
   ✓ string append for round: 10000 (4) 2426ms
     name                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · String Apppend  7,301.73  0.0903  1.5518  0.1370  0.1042  0.9249  1.0134  1.2532  ±3.69%     3651   fastest
   · Array Join      5,205.36  0.1647  0.7834  0.1921  0.1792  0.4604  0.5002  0.6862  ±1.16%     2603
   · String Concat   6,568.96  0.0900  2.2080  0.1522  0.1170  1.0464  1.3413  1.8205  ±4.19%     3286
   · Array Reduce    3,723.35  0.1953  1.8016  0.2686  0.2124  1.2565  1.3604  1.7835  ±3.84%     1862   slowest
   ✓ string append for round: 100000 (4) 2452ms
     name                hz     min      max    mean     p75      p99     p995     p999      rme  samples
   · String Apppend  322.83  0.9298   7.2716  3.0976  5.0186   6.8088   7.2716   7.2716  ±10.38%      163   fastest
   · Array Join      262.91  3.2032   8.1903  3.8035  3.8673   5.9698   8.1903   8.1903   ±3.55%      132
   · String Concat   320.76  0.9259   7.7736  3.1176  5.0550   6.9247   7.7736   7.7736  ±10.55%      161
   · Array Reduce    172.02  3.4613  12.0742  5.8133  7.4295  12.0742  12.0742  12.0742   ±8.14%       87   slowest


 BENCH  Summary

  String Apppend - src/string.bench.ts > string append for round: 1000
    1.07x faster than String Concat
    1.69x faster than Array Join
    2.14x faster than Array Reduce

  String Apppend - src/string.bench.ts > string append for round: 10000
    1.11x faster than String Concat
    1.40x faster than Array Join
    1.96x faster than Array Reduce

  String Apppend - src/string.bench.ts > string append for round: 100000
    1.01x faster than String Concat
    1.23x faster than Array Join
    1.88x faster than Array Reduce
```
