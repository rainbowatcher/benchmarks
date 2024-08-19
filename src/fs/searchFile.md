# Benches

## Recursive search

```rst
 ✓ src/fs/searchFile.bench.ts (18) 10891ms
   ✓ searchFile complex (9) 5449ms
     name                   hz     min      max    mean     p75     p99    p995     p999      rme  samples
   · fs               4,549.91  0.1815   2.8968  0.2198  0.2187  0.5241  0.5625   0.7090   ±1.67%     2277   fastest
   · fs/promises      1,120.28  0.7616   7.1663  0.8926  0.9114  1.5975  1.7788   7.1663   ±2.84%      561   slowest
   · fs/promises1     2,899.74  0.2328  58.9585  0.3449  0.2803  0.5729  0.6636  11.6881  ±23.61%     1450
   · fs/promises2     2,898.22  0.2767   1.3394  0.3450  0.3351  0.6569  0.7014   0.8092   ±1.45%     1450
   · fs/promises3     1,816.41  0.3421   1.7333  0.5505  0.6551  0.9138  0.9797   1.7333   ±1.74%      909
   · fast-glob Sync   3,239.41  0.2304   1.2895  0.3087  0.3139  0.9973  1.1676   1.2685   ±2.00%     1620
   · fast-glob Async  1,906.54  0.3942   3.4804  0.5245  0.5302  1.6138  1.7489   3.4804   ±2.86%      956
   · globby Sync      3,185.31  0.2524   1.2042  0.3139  0.3212  0.8524  0.9417   1.0794   ±1.66%     1593
   · globby Async     1,657.03  0.4600   2.3111  0.6035  0.6160  1.8268  2.0147   2.3111   ±2.45%      829
   ✓ searchFile complex (9) 5436ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · fs               4,699.89  0.1821  0.7949  0.2128  0.2104  0.4949  0.5551  0.7301  ±1.19%     2350   fastest
   · fs/promises      1,136.92  0.7652  2.0059  0.8796  0.9107  1.6098  1.8346  2.0059  ±1.44%      569   slowest
   · fs/promises1     3,434.47  0.2565  0.9495  0.2912  0.2851  0.6144  0.6998  0.8599  ±1.15%     1718
   · fs/promises2     2,782.17  0.2953  1.3250  0.3594  0.3693  0.7705  0.8744  1.0389  ±1.61%     1392
   · fs/promises3     1,899.99  0.3435  4.0968  0.5263  0.6506  1.0022  1.3166  4.0968  ±2.45%      950
   · fast-glob Sync   3,557.89  0.2225  1.4384  0.2811  0.2854  0.7757  0.8741  1.2611  ±1.85%     1779
   · fast-glob Async  1,978.48  0.4013  2.9184  0.5054  0.5017  1.6785  2.0453  2.9184  ±2.90%      990
   · globby Sync      3,178.88  0.2535  1.2771  0.3146  0.3213  0.8146  0.8849  1.0794  ±1.71%     1590
   · globby Async     1,670.99  0.4530  2.3154  0.5984  0.6035  1.6720  1.8556  2.3154  ±2.43%      836


 BENCH  Summary

  fs - src/fs/searchFile.bench.ts > searchFile complex
    1.40x faster than fast-glob Sync
    1.43x faster than globby Sync
    1.57x faster than fs/promises1
    1.57x faster than fs/promises2
    2.39x faster than fast-glob Async
    2.50x faster than fs/promises3
    2.75x faster than globby Async
    4.06x faster than fs/promises

  fs - src/fs/searchFile.bench.ts > searchFile complex
    1.32x faster than fast-glob Sync
    1.37x faster than fs/promises1
    1.48x faster than globby Sync
    1.69x faster than fs/promises2
    2.38x faster than fast-glob Async
    2.47x faster than fs/promises3
    2.81x faster than globby Async
    4.13x faster than fs/promises
```
