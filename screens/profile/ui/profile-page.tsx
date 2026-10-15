"use client";

import { useSession } from "next-auth/react";
import {
  Box,
  Button,
  Container,
  Heading,
  Skeleton,
  Text,
  VStack,
} from "@/shared/ui/kit";
import { logoutAction } from "@/screens/auth/model/actions";

export function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Container className="flex max-w-md flex-col gap-4 px-3 sm:px-0">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </Container>
    );
  }

  const user = session?.user;
  if (!user) {
    // До этого экрана без сессии не пускает middleware — состояние возможно
    // только в момент выхода, пока идёт редирект.
    return null;
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return (
    <Container className="flex max-w-md flex-col gap-6 px-3 sm:px-0">
      <Heading size="lg">Профиль</Heading>

      <Box className="bg-primary-100/10 rounded-2xl px-4 py-4">
        <VStack gap={1}>
          <Text className="font-medium">{fullName || "Без имени"}</Text>
          <Text
            variant="secondary"
            size="sm"
          >
            {user.email}
          </Text>
          {!user.isEmailVerified ? (
            <Text
              variant="error"
              size="xs"
            >
              Email не подтверждён
            </Text>
          ) : null}
        </VStack>
      </Box>

      <form action={logoutAction}>
        <Button
          type="submit"
          variant="secondary"
          size="full"
          className="h-12"
        >
          Выйти
        </Button>
      </form>
    </Container>
  );
}
