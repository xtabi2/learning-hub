-- runSeed was written as an unsigned 32-bit hash (up to 4294967295) but Prisma Int is signed i32.
-- Rows above 2147483647 made every ChildAdventure read throw P2023. Fold them into positive i32 range.
UPDATE "ChildAdventure" SET "runSeed" = ("runSeed" % 2147483647) + 1 WHERE "runSeed" > 2147483647 OR "runSeed" < 0;
